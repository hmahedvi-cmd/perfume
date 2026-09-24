import "./Skeleton.css";

function Skeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton image" />
      <div className="skeleton-card-info">
        <div className="skeleton line" />
        <div className="skeleton line short" />
      </div>
    </div>
  );
}

export default Skeleton;