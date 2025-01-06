interface Certificate {
  id: string;
  title: string;
  organization: string;
  image: string;
}

interface CertificateGalleryProps {
  certificates: Certificate[];
  onAddClick: () => void;
}

const CertificateGallery = ({ certificates, onAddClick }: CertificateGalleryProps) => {
  if (!certificates?.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 rounded-lg mt-8">
        <p className="text-gray-600 text-lg mb-4">No certificates added yet</p>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 text-main hover:underline"
        >
          Add your first certificate
        </button>
      </div>
    );
  }

  return (
    <>
      {certificates.map((cert, index) => (
        <div key={cert.id} className={`flex flex-row justify-between w-full mt-12 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
          <div className="flex flex-col justify-center items-center w-1/2">
            <div className="w-2/3">
              <p className="text-main text-2xl font-bold">
                {cert.title}
              </p>
              <p className="text-gray-600">{cert.organization}</p>
            </div>
          </div>

          <div className="w-1/2">
            <div className="flex items-center justify-center">
              <img
                className="transform duration-200 ease-in-out transition hover:translate-y-3 hover:shadow-xl object-contain h-72 cursor-pointer"
                src={cert.image}
                alt={cert.title}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CertificateGallery; 