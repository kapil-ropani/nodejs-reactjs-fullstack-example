import React, { useEffect, useState, memo } from "react";
import { throttle } from "throttle-debounce";
import "./App.css";



function App() {
  const [priceList, setPriceList] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState({bottles: 0, packs: 0, box: 0, price: 0});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/sample-data")
      .then((response) => {
        setLoading(true);
        return response.json();
      })
      .then((data) => {
        if (data.pricelist) {
          setLoading(false);
          console.log("data:", data);
          setPriceList(data.pricelist);
        }
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  }, []);

  const handleChange = (e) => {
    throttle(500, setQuantity(e.target.value));
    console.log(quantity);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requiredBottles: quantity,
        prices: [2.3, 25, 230],
        pieces: [1, 12, 120],
      }),
    };

    fetch("http://localhost:3000/calculate", requestOptions)
      .then((response) => response.json())
      .then((data) => setPrice(data))
      .catch((e) => console.error(e));
    // setQuantity()
  };

  return (
    <>
    {console.log("price: ", price)}
      {loading && <strong>Loading...</strong>}
      {error && <strong>Something goes wrong!</strong>}
      <input
        type="number"
        name="quantity"
        required
        placeholder="Quntity (number)"
        // value={quantity}
        onChange={handleChange}
        onKeyUp={handleChange}
      />
      <span>
        <strong className="border border-danger px-2 ml-2">Final Price:</strong>{" "}
        <strong className="border border-info px-2">{price.price}</strong>
      </span>
      <span>
        <strong className="border border-danger px-2 ml-2">Packs:</strong>{" "}
        <strong className="border border-info px-2">{price.packs}</strong>
      </span>
      <span>
        <strong className="border border-danger px-2 ml-2">Box:</strong>{" "}
        <strong className="border border-info px-2">{price.box}</strong>
      </span>
      <span>
        <strong className="border border-danger px-2 mx-2">Bottles:</strong>{" "}
        <strong className="border border-info px-2">{price.bottles}</strong>
      </span>

      <table className="table">
        <thead className="thead">
          <tr className="bg-light">
            <th className="text-center">Piece</th>
            <th className="text-center">Pack</th>
            <th className="text-center">Box</th>
          </tr>
        </thead>

        <tbody className="tbody">
          {priceList.map((item, key) => {
            return (
              <tr key={key}>
                <td className="border">
                  <strong>NAME: </strong>
                  {item["piece"].name}, <strong>QUANTITY: </strong>
                  {item["piece"].quantity}, <strong>PRICE: </strong>
                  {item["piece"].price}
                </td>
                <td className="border">
                  <strong>NAME: </strong>
                  {item["pack"].name}, <strong>QUANTITY: </strong>
                  {item["pack"].quantity}, <strong>PRICE: </strong>
                  {item["pack"].price}
                </td>
                <td className="border">
                  <strong> NAME: </strong>
                  {item["box"].name}, <strong>QUANTITY: </strong>
                  {item["box"].quantity}, <strong>PRICE: </strong>
                  {item["box"].price}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default memo(App);
