import { Link, useParams } from 'react-router-dom';
import UnderConstruction from '../components/common/UnderConstruction';

function ClassDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <UnderConstruction
      title={`Class Details #${id ?? ''}`}
      description="Full class information is coming soon."
    >
      {/* Temporary button so you can test the "login before booking" redirect */}
      <p>
        <Link to={`/classes/${id}/book`} className="btn btn-outline">
          Book this class
        </Link>
      </p>
    </UnderConstruction>
  );
}

export default ClassDetailsPage;