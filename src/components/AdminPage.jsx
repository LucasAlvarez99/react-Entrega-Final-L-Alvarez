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
import Spinner from "react-bootstrap/Spinner";
import { addProduct } from "../services/productsService";
import { uploadImages } from "../services/storageService";
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
    images: [],
  });

  const [merchandiseItem, setMerchandiseItem] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [loadingSeed, setLoadingSeed] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);

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

  const handleImageUpload = (e) => {
    const files = e.target.files;
    
    if (files.length > 3) {
      alert("Solo puedes subir máximo 3 imágenes");
      e.target.value = "";
      return;
    }

    // Guardar archivos para subir después
    setSelectedFiles(files);

    // Crear previews
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
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

    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Por favor selecciona al menos una imagen");
      return;
    }

    try {
      setUploadingImages(true);

      // Subir imágenes a Firebase Storage
      console.log("Subiendo imágenes a Firebase Storage...");
      const imageUrls = await uploadImages(selectedFiles);
      
      // Crear objeto del show con las URLs de las imágenes
      const newShow = {
        ...showForm,
        images: imageUrls, // URLs reales de Firebase Storage
        spaces: showForm.spaces.map((space) => ({
          ...space,
          price: Number(space.price),
          stock: Number(space.stock),
        })),
      };

      setUploadingImages(false);

      // Guardar producto en Firestore
      console.log("Guardando show en Firestore...");
      const savedProduct = await addProduct(newShow);
      
      console.log("✅ Show creado exitosamente:", savedProduct);
      
      setSubmitted(true);
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (error) {
      console.error("Error al crear show:", error);
      alert("Error al crear el show. Verifica tu conexión y las reglas de Firebase Storage.");
      setUploadingImages(false);
    }
  };

  const handleLoadSampleData = async () => {
    if (window.confirm("¿Cargar productos de ejemplo en Firebase? Esto agregará 3 shows de muestra.")) {
      setLoadingSeed(true);
      try {
        await seedProducts();
        alert("✅ Productos de ejemplo cargados exitosamente!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        alert("❌ Error al cargar productos de ejemplo");
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
        Crea y administra shows, entradas y merchandise
      </p>

      {submitted && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>¡Show creado exitosamente!</Alert.Heading>
          <p>El show ha sido agregado al catálogo. Redirigiendo al inicio...</p>
        </Alert>
      )}

      {uploadingImages && (
        <Alert variant="info" className="mb-4">
          <Spinner animation="border" size="sm" className="me-2" />
          Subiendo imágenes a Firebase Storage...
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

        {/* IMÁGENES */}
        <Card className="shadow mb-4">
          <Card.Body>
            <h5 className="mb-3">Imágenes del Show</h5>
            <Form.Group className="mb-3">
              <Form.Label>Subir Imágenes (máximo 3)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                required
              />
              <Form.Text className="text-muted">
                Las imágenes se subirán a Firebase Storage y se mostrarán en un carrusel
              </Form.Text>
            </Form.Group>

            {previewImages.length > 0 && (
              <Row className="mt-3">
                {previewImages.map((img, index) => (
                  <Col xs={4} key={index}>
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="img-fluid rounded"
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                  </Col>
                ))}
              </Row>
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
            disabled={submitted || uploadingImages}
          >
            {uploadingImages ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  className="me-2"
                />
                Subiendo imágenes...
              </>
            ) : submitted ? (
              "Creando..."
            ) : (
              "Crear Show"
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AdminPage;