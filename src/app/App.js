import React, { useState, useEffect } from "react";
import Logo from "./logo/cat-a-pix.png";
import './App.css';
import { CustomButton } from "./components/Button";

function App() {
  // State to collect data
  const [catRepo, setCatRepo] = useState([]);
  const [picture, setPicture] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);

  // Load items from localStorage on initial render
  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem("catRepo"));
    if (storedList) {
      setCatRepo(storedList);
    }
  }, []);

  // Save items to localStorage whenever the catList changes
  useEffect(() => {
    localStorage.setItem("catRepo", JSON.stringify(catRepo));
  }, [catRepo]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form Validation
    if (!picture && !isUpdating) {
      alert("Please upload a picture.");
      return;
    };
    if (!name.trim()) {
      alert("Please enter a name.");
      return;
    };
    if (!category.trim()) {
      alert("Please choose a category.");
      return;
    }

    const base64Image = picture ? await convertImageToBase64(picture) : catRepo[currentItemIndex].picture;

    const newItem = {picture: base64Image, name, category};

    if (isUpdating) {
      updateItem(newItem, currentItemIndex);
      setIsUpdating(false);
      setCurrentItemIndex(null);
    } else {
      createItem(newItem);
    }

    // Reset form fields
    setPicture(null);
    setName("");
    setCategory("");

  };

  // Convert image file to Base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject("Failed to read file");
      };
      reader.readAsDataURL(file);
    });
  };

  // Create a new item
  const createItem = (item) => {
    setCatRepo([...catRepo, item]);
  };

  // Update an existing item
  const updateItem = (newItem, index) => {
    const updatedCatRepo = [...catRepo];
    updatedCatRepo[index] = newItem;
    setCatRepo(updatedCatRepo);
  };

  // Delete an item
  const deleteItem = (index) => {
    const filteredRepo = catRepo.filter((_, i) => i !== index);
    setCatRepo(filteredRepo);
  };

  // Delete checked items
  const deleteCheckedItems = () => {
    const checkboxes = document.querySelectorAll(".item-checkbox");
    const filteredRepo = catRepo.filter((_, i) => !checkboxes[i].checked);
    setCatRepo(filteredRepo);
  };

  // Prefill form for editing
  const editItem = (index) => {
    const item = catRepo[index];
    setPicture(null); 
    setName(item.name);
    setCategory(item.category);
    setIsUpdating(true);
    setCurrentItemIndex(index);
  }


  return (
    <section className="wrapper">
      <header>
        <img className="logo" src={Logo} alt="Cat-A-Pix logo" />
        <h1>Cat-A-Pix</h1>
      </header>
      <main>
        <div className="form-container">
          <h3>Your Cat Repository</h3>
          <form onSubmit={handleSubmit}>
            <div className="choice">
              <label htmlFor="picture">Picture</label>
              <input type="file" id="picture" name="file" accept=".png, .jpg, .jpeg" onChange={(e) => setPicture(e.target.files[0])}
                required />
            </div>
            <div className="name-input">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="select">
              <label htmlFor="categories">Category</label>
              <select name="category" id="categories" value={category} onChange={(e) => setCategory(e.target.value)} >
                <option value="">Select a category</option>
                <option value="Domestic Cats">Domestic cats</option>
                <option value="Wild Cats">Wild cats</option>
              </select>
            </div><br></br>
            <div>
              <CustomButton className="button">{isUpdating ? "Update" : "Create"} Item</CustomButton>
            </div>
          </form>
        </div>
        <div className="display-gallery">
          <ul>
            {catRepo.map((item, index) => (
              <li key={index}>
                <img src={item.picture} alt={item.name} />
                <input type="checkbox" className="item-checkbox" />
                <span>{item.name} ({item.category})</span><br></br>
                <CustomButton className="edit-button" onClick={() => editItem(index)}>Edit</CustomButton>
                <CustomButton className="delete-button" onClick={() => deleteItem(index)}>Delete</CustomButton>
              </li>
            ))}
          </ul><br></br>

          <CustomButton className="clear-button" onClick={deleteCheckedItems}>Delete Checked Items</CustomButton>
        </div>
      </main>
    </section>
  )
}

export default App;


