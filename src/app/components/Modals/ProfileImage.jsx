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

const ProfileImageModal = ({ isOpen, onClose }) => {
  const [imageSrc, setImageSrc] = useState(
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1728986004~exp=1728989604~hmac=4c5bb8c8d9793d04026cc7a1fda5a540f05c3688152f10938296a3eef812fe02&w=740"
  );
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
    if (cropper) {
      setCroppedImage(cropper.getCroppedCanvas().toDataURL());
      setHasChanges(true);
    }
  };

  const handleRemoveImage = () => {
    setImageSrc(
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1728986004~exp=1728989604~hmac=4c5bb8c8d9793d04026cc7a1fda5a540f05c3688152f10938296a3eef812fe02&w=740"
    );
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

  return (
    <Modal
      isOpen={isOpen}
      isCentered
      size="md"
      onClose={onClose}
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent rounded="none">
        <ModalHeader>Edit Profile Picture</ModalHeader>
        <ModalCloseButton
          onClick={onClose}
          size="sm"
          color="black"
          bgColor="white"
          rounded="none"
          border="1px solid black"
          shadow="sm"
          top="1rem"
          _hover={{ bgColor: "black", color: "white" }}
        />
        <Divider />
        <ModalBody>
          <Cropper
            src={imageSrc}
            style={{ height: 400, width: "100%" }}
            initialAspectRatio={1}
            guides={false}
            ref={cropperRef}
            crop={getCroppedImage}
            zoomTo={0.5}
            viewMode={1}
          />
        </ModalBody>
        <Divider />
        <ModalFooter>
          <Flex bg="white" justifyContent="space-between" width="100%" gap="2">
            <Button
              onClick={() => document.getElementById("replacePicInput").click()}
              size="md"
              bgColor="black"
              color="white"
              rounded="none"
              width="50%"
              border="1px solid transparent"
              shadow="sm"
              _hover={{
                bgColor: "white",
                color: "black",
                borderColor: "black",
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
              color="black"
              bgColor="white"
              rounded="none"
              border="1px solid black"
              shadow="sm"
              _hover={{
                color: "white",
                bgColor: "black",
                borderColor: "black",
              }}
              isDisabled={isLoading}
            >
              Remove Profile Picture
            </Button>
            {hasChanges && (
              <Button
                size="md"
                width="50%"
                color="black"
                bgColor="white"
                rounded="none"
                border="1px solid transparent"
                shadow="sm"
                _hover={{
                  color: "white",
                  bgColor: "black",
                  borderColor: "black",
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
