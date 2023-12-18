import React from 'react';

interface Props {
  width?: number;
  height?: number;
  content: string;
  onTranslation: () => void;
}

function CreateTranslation(props: {width, height, content, onTranslation}) {
  return (
    <div>
      {/* Your component content here */}
    </div>
  );
}

export default CreateTranslation;
