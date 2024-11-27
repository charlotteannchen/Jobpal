import React, { useEffect, useState } from 'react';

const Component = () => {
    const [isEditing, setIsEditing] = useState(false);
  
    console.log('Component render');
  
    useEffect(() => {
      console.log('useEffect runs');
    }, []);
  
    return (
      <div>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Stop Editing' : 'Start Editing'}
        </button>
      </div>
    );
  };

  export default Component;
  