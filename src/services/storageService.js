import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Subir múltiples imágenes a Firebase Storage
 * @param {FileList} files - Lista de archivos a subir
 * @param {string} folder - Carpeta donde guardar las imágenes
 * @returns {Promise<string[]>} - Array de URLs de las imágenes subidas
 */
export const uploadImages = async (files, folder = "shows") => {
  try {
    const uploadPromises = Array.from(files).map(async (file) => {
      // Crear nombre único para el archivo
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}_${file.name}`;
      
      // Crear referencia en Storage
      const storageRef = ref(storage, fileName);
      
      // Subir archivo
      const snapshot = await uploadBytes(storageRef, file);
      
      // Obtener URL pública
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    });

    // Esperar a que todas las imágenes se suban
    const imageUrls = await Promise.all(uploadPromises);
    
    console.log("✅ Imágenes subidas exitosamente:", imageUrls);
    return imageUrls;
    
  } catch (error) {
    console.error("❌ Error al subir imágenes:", error);
    throw error;
  }
};

/**
 * Subir una sola imagen
 * @param {File} file - Archivo a subir
 * @param {string} folder - Carpeta donde guardar
 * @returns {Promise<string>} - URL de la imagen
 */
export const uploadSingleImage = async (file, folder = "shows") => {
  try {
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    throw error;
  }
};