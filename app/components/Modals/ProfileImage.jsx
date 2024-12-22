import { useState, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import defaultProfile from "@/public/Image/defaultProfile.svg"
import { VscEdit } from "react-icons/vsc";


const ProfileImageModal = ({ isOpen, onClose }) => {

  const [imageSrc, setImageSrc] = useState(defaultProfile);
  const [croppedImage, setCroppedImage] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const cropperRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);



  const handleReplaceImage = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      ["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(file.type)
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper && cropper.getCroppedCanvas()) {
      setCroppedImage(cropper.getCroppedCanvas().toDataURL());
      setHasChanges(true);
    }
  };

  const handleRemoveImage = () => {
    setImageSrc(defaultProfile);
    setCroppedImage(null);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (hasChanges) {
      console.log("Saved image:", croppedImage || imageSrc);
      setHasChanges(false);
      onClose();
    }
  };

  const handleCloseModal = () => {
    setCroppedImage(null);
    setImageSrc(defaultProfile);
    onClose();
  };
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      isCentered
      size="md"
      onClose={handleCloseModal}
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent rounded="sm">
        <ModalHeader>Edit Picture</ModalHeader>
        <ModalCloseButton
          onClick={handleCloseModal}
          size="sm"
          color="gray.900"
          bgColor="white"
          rounded="sm"
          border="1px solid gray.900"
          shadow="sm"
          top="1rem"
          _hover={{ bgColor: "gray.900", color: "white" }}
        />
        <Divider />
        <ModalBody>
          {isImageLoaded && (
            <Cropper
              src={imageSrc}
              style={{ height: 400 }}
              initialAspectRatio={1}
              guides={false}
              ref={cropperRef}
              crop={getCroppedImage}
              zoomTo={0.5}
              viewMode={1}
            />
          )}
          <img src={imageSrc} onLoad={handleImageLoad} style={{ display: 'none' }} />
        </ModalBody>
        <Divider />
        <ModalFooter>
          <Flex bg="white" justifyContent="space-between" width="100%" gap="2">
            <Button
              onClick={() => document.getElementById("replacePicInput").click()}
              size="md"
              bgColor="gray.900"
              color="white"
              rounded="sm"
              width="50%"
              border="1px solid transparent"
              shadow="sm"
              _hover={{
                bgColor: "white",
                color: "gray.900",
                borderColor: "gray.900",
              }}
              isDisabled={isLoading}
            >
              Replace Picture
            </Button>
            <input
              id="replacePicInput"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              style={{ display: "none" }}
              onChange={handleReplaceImage}
            />
            <Button
              onClick={handleRemoveImage}
              size="md"
              width="50%"
              color="gray.900"
              bgColor="white"
              rounded="sm"
              border="1px solid gray.900"
              shadow="sm"
              _hover={{
                color: "white",
                bgColor: "gray.900",
                borderColor: "gray.900",
              }}
              isDisabled={isLoading}
            >
              Remove Picture
            </Button>
            {hasChanges && (
              <Button
                size="md"
                width="50%"
                color="gray.900"
                bgColor="white"
                rounded="sm"
                border="1px solid transparent"
                shadow="sm"
                _hover={{
                  color: "white",
                  bgColor: "gray.900",
                  borderColor: "gray.900",
                }}
                isDisabled={isLoading}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

};

export default ProfileImageModal;
