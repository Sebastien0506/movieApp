import React, { useState } from "react";

// On définit les types des props
interface CategoryFilterProps {
    categories: string[]; // La liste des catégories (ex: ["Action", "Comedy"])
    selectedCategories: string[]; // Les catégories sélectionnées
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>; // Fonction pour modifier les catégories sélectionnées
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategories, setSelectedCategories }) => {
    const [open, setOpen] = useState(false);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(category)
                ? prevSelected.filter((cat) => cat !== category)
                : [...prevSelected, category]
        );
    };

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            {/* On ajoute un bouton pour ouvrir et fermer la selection des catégorie */}
            <button onClick={() => setOpen(!open)} style={{ padding: "10px", cursor: "pointer" }}>
                Filtrer par catégorie ▼
            </button>

            {/* On crée la liste déroulante */}
            {open && (
                <div style={{
                    position: "absolute",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                    padding: "10px",
                    zIndex: 10,
                    width: "200px",
                    maxHeight: "200px",
                    overflowY: "auto"
                }}>
                    {categories.map((category) => (
                        <label key={category} style={{ display: "block", padding: "5px" }}>
                            <input
                                type="checkbox"
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            /> {category}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryFilter;