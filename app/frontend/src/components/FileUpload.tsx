import React, { ReactElement, useEffect, useRef, useState } from 'react';

interface IProductDTO {
  code: number | string;
  name: string;
  current_price: number | string;
  new_price: number | string;
  validation: string;
}

const FileUpload = (): ReactElement => {
  const [products, setProducts] = useState<IProductDTO[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);

  const fileInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!fileInput.current || !fileInput.current.files) return;

    const file = fileInput.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3001/products', {
      method: 'POST',
      body: formData,
    });

    setProducts((await response.json()).validatedProducts);

    // checkIfItsValid();

    if (response.ok) {
      console.log('File uploaded successfully');
    } else {
      console.log('File upload failed');
    }
  };
  
  useEffect(() => {
    setIsValid(!!products && products.every((product) => product.validation.toUpperCase() === 'OK'));
  }, [products])
  
  console.log(isValid);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file">Carregue o arquivo CSV:</label>
        <input type="file" id="file" name="file" ref={fileInput} />
        <button type="submit">Validar</button>
      </form>

      <button disabled={!isValid || !!products}>Atualizar</button>

      {products &&
        products.map((product) => (
          <div key={product.code}>
            <p>Código: {product.code}</p>
            <p>Produto: {product.name}</p>
            <p>Preço atual: {product.current_price}</p>
            <p>Novo preço: {product.new_price}</p>
            <p>Válido: {product.validation}</p>
          </div>
        ))}
    </>
  );
};

export default FileUpload;
