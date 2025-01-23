import React, { useRef, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image, useToast } from "@chakra-ui/react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useSession } from "next-auth/react";

const ProfileImageModal = ({ isOpen, onClose, currentImage, onImageSave }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const cropperRef = useRef(null);
  const toast = useToast();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current.cropper;
    const croppedCanvas = cropper.getCroppedCanvas();

    croppedCanvas.toBlob((blob) => {
      const croppedFile = new File([blob], "croppedImage.jpg", { type: "image/jpeg" });
      onImageSave(userId, croppedFile);
    });
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile Picture</ModalHeader>
        <ModalBody>
          {selectedFile ? (
            <Cropper
              src={selectedFile}
              style={{ height: 400, width: "100%" }}
              initialAspectRatio={1}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
            />
          ) : (
            <Image src={currentImage} alt="Current Profile" boxSize="150px" borderRadius="full" mx="auto" />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: "16px" }} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCrop} disabled={!selectedFile}>
            Crop & Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileImageModal;
