type RocketCardProps = {
  title: string;
  children: React.ReactNode;
  vertical?: boolean;
};

export function RocketCard({ title, children, vertical }: RocketCardProps) {
  return (
    <div className="card">
      <div className="card-header">{title}</div>
      <div className={`card-body ${vertical ? "vertcl" : ""}`}>{children}</div>
    </div>
  );
}

