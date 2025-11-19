
const IMGBB_API_KEY = "4b69ea9c24dcfbfab5b8d4dc3784b006";

export const uploadToImgBB = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data.url;
    }
    return null;
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    return null;
  }
};
