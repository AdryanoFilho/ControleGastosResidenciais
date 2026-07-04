interface PageHeaderProps {
  titulo: string;
  subtitulo: string;
}

export function PageHeader({ titulo, subtitulo }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1>{titulo}</h1>
      <p>{subtitulo}</p>
    </header>
  );
}
