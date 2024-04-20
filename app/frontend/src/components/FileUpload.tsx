import React, { ReactElement, useRef, useState } from 'react';
import '../../src/styles/components/fileUpload.css';

interface IProductDTO {
  code: number | string;
  name: string;
  current_price: number | string;
  new_price: number | string;
  validation: string;
}

const FileUpload = (): ReactElement => {
  const [products, setProducts] = useState<IProductDTO[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const fileInput = useRef<HTMLInputElement>(null);

  const handleValidateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!fileInput.current || !fileInput.current.files) return;

    const file = fileInput.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3001/products', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('File uploaded successfully');
      const data = (await response.json()).validatedProducts;
      setProducts(data);

      const allValid = data.every(
        (product: { validation: string }) => product.validation === 'OK'
      );
      setIsDisabled(!allValid); // allValid retorna true se todos os produtos são validos. Portanto preciso passar false para que disabled=false.
    } else {
      console.log('File upload failed');
    }
  };

  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const update = await fetch('http://localhost:3001/products', {
      method: 'PATCH',
    });

    if (update.ok) {
      console.log('Products updated successfully');
      setProducts([]);
      if (fileInput.current) {
        fileInput.current.value = '';
      }
      setIsDisabled(true);
    } else {
      console.log('Products update failed');
    }
  };

  console.log(isDisabled);
  return (
    <>
      <div className="headerDiv">
        <form onSubmit={handleValidateSubmit}>
          <label htmlFor="file">Carregue o arquivo CSV:</label>
          <input type="file" id="file" name="file" ref={fileInput} />
          <button type="submit" className="validateBtn">
            Validar
          </button>
        </form>

        <button
          type="button"
          className="updateBtn"
          disabled={isDisabled}
          onClick={handleUpdateSubmit}
        >
          Atualizar
        </button>
      </div>

      <div className="productsDiv">
        {products &&
          products.map((product) => (
            <div className="productCard" key={product.code}>
              <table>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Preço Atual</th>
                  <th>Novo Preço</th>
                  <th>Validação</th>
                </tr>
                <p>Código: {product.code}</p>
                <p>Nome: {product.name}</p>
                <p>Preço Atual: {product.current_price}</p>
                <p>Novo Preço: {product.new_price}</p>
                <p>Validação: {product.validation}</p>
              </table>
            </div>
          ))}
      </div>
    </>
  );
};

export default FileUpload;
