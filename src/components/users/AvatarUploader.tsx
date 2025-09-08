import { useState, useCallback } from "react";
import { components } from "../../types/api";
import { Avatar } from "./Avatar";
import { useUploadAvatar } from "../../api/users";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import "./AvatarUploader.style.css";

type UserPublic = components["schemas"]["UserPublic"];

type AvatarUser = Partial<
  Pick<
    UserPublic,
    "username" | "first_name" | "last_name" | "avatar_url" | "updated_at"
  >
>;

interface AvatarUploaderProps {
  user: AvatarUser;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ user }) => {
  const [preview, setPreview] = useState(user.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const uploadAvatar = useUploadAvatar();

  const onCropComplete = useCallback((_: undefined, croppedPixels: null) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropAndUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setUploading(true);
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const formData = new FormData();
    formData.append("file", croppedBlob, "avatar.jpeg");

    uploadAvatar.mutate(formData, {
      onSuccess: (data) => {
        setPreview(data.avatar_url);
        setImageSrc(null); // close cropper
        setUploading(false);
        window.location.reload();
      },
      onError: () => {
        setUploading(false);
      },
    });
  };

  console.log(preview);

  return (
    <div className="avatar-upload-wrapper">
      <Avatar user={{ ...user, avatar_url: preview }} size={120} />
      {/* <Avatar user={{ ...user }} size={120} /> */}

      <label className="change-avatar-btn">
        {uploading ? "Uploading..." : "Change Avatar"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          hidden
        />
      </label>

      {imageSrc && (
        <div className="cropper-container">
          <div className="cropper">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="cropper-controls">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(+e.target.value)}
            />
            <button onClick={handleCropAndUpload} disabled={uploading}>
              Save Avatar
            </button>
            <button onClick={() => setImageSrc(null)} disabled={uploading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
