import React, { useState } from 'react';

interface Item {
  id: number;
  text: string;
  subItems: string[];
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemText, setNewItemText] = useState<string>('');
  const [showSubItems, setShowSubItems] = useState<boolean[]>([]);

  const handleAddItem = () => {
    const newItem: Item = {
      id: items.length + 1,
      text: newItemText,
      subItems: [],
    };
    setItems([...items, newItem]);
    setNewItemText('');
    setShowSubItems([...showSubItems, false]);
  };

  const handleAddSubItem = (itemId: number) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, subItems: [...item.subItems, newItemText] } : item
    );
    setItems(updatedItems);
    setNewItemText('');
  };

  const toggleSubItems = (itemId: number) => {
    setShowSubItems((prevShowSubItems) =>
      prevShowSubItems.map((show, index) => (index === itemId ? !show : show))
    );
  };

  return (
    <div>
      <h1>Items List</h1>
      <input
        type="text"
        value={newItemText}
        onChange={(e) => setNewItemText(e.target.value)}
        placeholder="Enter item text"
      />
      <button onClick={handleAddItem}>Add Item</button>

      {items.map((item, index) => (
        <div key={item.id} style={{ marginLeft: '20px' }}>
          <div>
            
            <span>{item.text}</span>
            <button onClick={() => handleAddSubItem(item.id)}>Add Subitem</button>
            <button onClick={() => toggleSubItems(index)}>
              {showSubItems[index] ? 'Hide Subitems' : 'Show Subitems'}
            </button>
          </div>

          {showSubItems[index] && (
            <ul>
              {item.subItems.map((subItem, subIndex) => (
                <li key={subIndex}>{subItem}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
