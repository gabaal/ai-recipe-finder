// components/RecipeCard.js
export default function RecipeCard({ recipe, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        border: "1px solid #ccc",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <img
        src={recipe.imageUrl}
        alt={recipe.title}
        width="100"
        height="100"
        style={{ marginRight: "1rem", borderRadius: "8px" }}
      />
      <div>
        <h2 style={{ margin: 0 }}>{recipe.title}</h2>
        <p style={{ margin: "0.5rem 0" }}>
          Matched Ingredients: {recipe.matchCount}
        </p>
      </div>
    </div>
  );
}
