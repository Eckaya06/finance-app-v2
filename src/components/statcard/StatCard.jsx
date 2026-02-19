import './StatCard.css'; // Bu CSS dosyasını birazdan oluşturacağız

const StatCard = ({ title, amount, variant = 'default' }) => {
  // Prop'tan gelen 'variant' değerine göre dinamik olarak bir CSS class'ı oluşturuyoruz.
  // Bu sayede karta 'primary' (ana) veya 'default' (varsayılan) stili verebileceğiz.
  const cardClassName = `stat-card ${variant}`; // Örn: "stat-card" veya "stat-card primary"

  return (
    <div className={cardClassName}>
      <p className="stat-card-title">{title}</p>
      <h3 className="stat-card-amount">{amount}</h3>
    </div>
  );
};

export default StatCard;