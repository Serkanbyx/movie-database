import { useParams } from 'react-router-dom';

const DetailPage = () => {
  const { mediaType, id } = useParams();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">
        Detail — {mediaType} / {id}
      </h1>
    </div>
  );
};

export default DetailPage;
