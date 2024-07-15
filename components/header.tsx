interface HeaderProps {
  numberArticles: number;
}

const Header = ({ numberArticles }: HeaderProps) => {
  return (
    <header>
      <h1>CDRXIV</h1>
      <p>{numberArticles} articles</p>
    </header>
  );
};

export default Header;
