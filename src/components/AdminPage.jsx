import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import { addProduct } from "../services/productsService";
import { seedProducts } from "../scripts/seedProducts";

function AdminPage() {
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState({
    title: "",
    artist: "",
    date: "",
    venue: "",
    category: "",
    spaces: [
      { name: "Campo Delantero", price: "", stock: "" },
      { name: "Campo Trasero", price: "", stock: "" },
      { name: "Campo VIP", price: "", stock: "" },
      { name: "Platea Baja", price: "", stock: "" },
      { name: "Platea Media", price: "", stock: "" },
      { name: "Platea Alta", price: "", stock: "" },
    ],
    merchandise: [],
    imageUrls: "", // URLs separadas por comas
  });

  const [merchandiseItem, setMerchandiseItem] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loadingSeed, setLoadingSeed] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShowForm({
      ...showForm,
      [name]: value,
    });
  };

  const handleSpaceChange = (index, field, value) => {
    const updatedSpaces = [...showForm.spaces];
    updatedSpaces[index][field] = value;
    setShowForm({
      ...showForm,
      spaces: updatedSpaces,
    });
  };

  const handleAddMerchandise = () => {
    if (merchandiseItem.name && merchandiseItem.price && merchandiseItem.stock) {
      setShowForm({
        ...showForm,
        merchandise: [
          ...showForm.merchandise,
          {
            id: `m${Date.now()}`,
            ...merchandiseItem,
            price: Number(merchandiseItem.price),
            stock: Number(merchandiseItem.stock),
          },
        ],
      });
      setMerchandiseItem({ name: "", price: "", stock: "" });
    }
  };

  const handleRemoveMerchandise = (index) => {
    const updatedMerchandise = showForm.merchandise.filter(
      (_, i) => i !== index
    );
    setShowForm({
      ...showForm,
      merchandise: updatedMerchandise,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convertir URLs separadas por comas en array
      const imageArray = showForm.imageUrls
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      if (imageArray.length === 0) {
        alert("Por favor ingresa al menos una URL de imagen");
        return;
      }

      // Crear objeto del show
      const newShow = {
        title: showForm.title,
        artist: showForm.artist,
        date: showForm.date,
        venue: showForm.venue,
        category: showForm.category,
        images: imageArray, // Array de URLs locales
        spaces: showForm.spaces.map((space) => ({
          ...space,
          price: Number(space.price),
          stock: Number(space.stock),
        })),
        merchandise: showForm.merchandise,
      };

      // Guardar en Firestore
      console.log("Guardando show en Firestore...");
      await addProduct(newShow);
      
      console.log("✅ Show creado exitosamente");
      setSubmitted(true);
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (error) {
      console.error("Error al crear show:", error);
      alert("Error al crear el show. Verifica la consola.");
    }
  };

  const handleLoadSampleData = async () => {
    if (window.confirm("¿Cargar productos de ejemplo? Esto agregará 6 shows con imágenes locales.")) {
      setLoadingSeed(true);
      try {
        await seedProducts();
        alert("✅ Productos de ejemplo cargados!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        alert("❌ Error al cargar productos");
        console.error(error);
      } finally {
        setLoadingSeed(false);
      }
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Panel de Administración</h2>
        <Button 
          variant="info" 
          onClick={handleLoadSampleData}
          disabled={loadingSeed}
        >
          {loadingSeed ? "Cargando..." : "🌱 Cargar Datos de Ejemplo"}
        </Button>
      </div>
      
      <p className="text-center text-muted mb-5">
        Crea shows con imágenes locales (sin Firebase Storage)
      </p>

      {submitted && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>¡Show creado exitosamente!</Alert.Heading>
          <p>Redirigiendo al inicio...</p>
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* INFORMACIÓN BÁSICA */}
        <Card className="shadow mb-4">
          <Card.Body>
            <h5 className="mb-3">Información del Show</h5>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Título del Show</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={showForm.title}
                    onChange={handleInputChange}
                    placeholder="Ej: Metallica - Master of Puppets"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Artista/Banda</Form.Label>
                  <Form.Control
                    type="text"
                    name="artist"
                    value={showForm.artist}
                    onChange={handleInputChange}
                    placeholder="Ej: Metallica"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha del Show</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={showForm.date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Lugar</Form.Label>
                  <Form.Control
                    type="text"
                    name="venue"
                    value={showForm.venue}
                    onChange={handleInputChange}
                    placeholder="Ej: Estadio Monumental"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría (URL)</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={showForm.category}
                    onChange={handleInputChange}
                    placeholder="Ej: metallica"
                    required
                  />
                  <Form.Text className="text-muted">
                    Sin espacios ni mayúsculas
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* IMÁGENES LOCALES */}
        <Card className="shadow mb-4">
          <Card.Body>
            <h5 className="mb-3">Imágenes del Show (URLs Locales)</h5>
            
            <Alert variant="info" className="mb-3">
              <strong>📁 Formato:</strong> Las imágenes deben estar en <code>/public/images/shows/</code>
              <br />
              <strong>Ejemplo:</strong> /images/shows/metallica-1.jpg, /images/shows/metallica-2.jpg
            </Alert>

            <Form.Group className="mb-3">
              <Form.Label>URLs de Imágenes (separadas por comas)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="imageUrls"
                value={showForm.imageUrls}
                onChange={handleInputChange}
                placeholder="/images/shows/metallica-1.jpg, /images/shows/metallica-2.jpg, /images/shows/metallica-3.jpg"
                required
              />
              <Form.Text className="text-muted">
                Máximo 3 imágenes. Las URLs deben empezar con /images/
              </Form.Text>
            </Form.Group>

            {showForm.imageUrls && (
              <div className="mt-3">
                <strong>Vista previa:</strong>
                <Row className="mt-2">
                  {showForm.imageUrls.split(',').slice(0, 3).map((url, index) => (
                    <Col xs={4} key={index}>
                      <img
                        src={url.trim()}
                        alt={`Preview ${index + 1}`}
                        className="img-fluid rounded"
                        style={{ height: "150px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* ESPACIOS Y PRECIOS */}
        <Card className="shadow mb-4">
          <Card.Body>
            <h5 className="mb-3">Espacios y Precios</h5>
            <p className="text-muted small mb-3">
              Los precios incluirán automáticamente un 10% de service charge
            </p>

            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Espacio</th>
                  <th>Precio Base ($)</th>
                  <th>Stock</th>
                  <th>Precio Final</th>
                </tr>
              </thead>
              <tbody>
                {showForm.spaces.map((space, index) => (
                  <tr key={index}>
                    <td>{space.name}</td>
                    <td>
                      <Form.Control
                        type="number"
                        value={space.price}
                        onChange={(e) =>
                          handleSpaceChange(index, "price", e.target.value)
                        }
                        placeholder="0"
                        required
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={space.stock}
                        onChange={(e) =>
                          handleSpaceChange(index, "stock", e.target.value)
                        }
                        placeholder="0"
                        required
                      />
                    </td>
                    <td className="text-success fw-bold">
                      ${space.price ? (Number(space.price) * 1.1).toFixed(0) : "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* MERCHANDISE */}
        <Card className="shadow mb-4">
          <Card.Body>
            <h5 className="mb-3">Merchandise</h5>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Control
                  type="text"
                  value={merchandiseItem.name}
                  onChange={(e) =>
                    setMerchandiseItem({
                      ...merchandiseItem,
                      name: e.target.value,
                    })
                  }
                  placeholder="Nombre del producto"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="number"
                  value={merchandiseItem.price}
                  onChange={(e) =>
                    setMerchandiseItem({
                      ...merchandiseItem,
                      price: e.target.value,
                    })
                  }
                  placeholder="Precio"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="number"
                  value={merchandiseItem.stock}
                  onChange={(e) =>
                    setMerchandiseItem({
                      ...merchandiseItem,
                      stock: e.target.value,
                    })
                  }
                  placeholder="Stock"
                />
              </Col>
              <Col md={2}>
                <Button
                  variant="success"
                  onClick={handleAddMerchandise}
                  className="w-100"
                  type="button"
                >
                  Agregar
                </Button>
              </Col>
            </Row>

            {showForm.merchandise.length > 0 && (
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {showForm.merchandise.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>${item.price.toLocaleString()}</td>
                      <td>{item.stock}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveMerchandise(index)}
                          type="button"
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* BOTÓN SUBMIT */}
        <div className="text-center">
          <Button 
            variant="primary" 
            type="submit" 
            size="lg" 
            className="px-5"
            disabled={submitted}
          >
            {submitted ? "Creando..." : "Crear Show"}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AdminPage;