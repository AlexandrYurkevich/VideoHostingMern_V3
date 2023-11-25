export default function Scroller({ onEndContent, children }) {
  const handleScroll = (e) => {
    if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight - 2) {
      onEndContent();
    }
  };

  return (
    <div onScroll={handleScroll}>
      {children}
    </div>
  );
};