import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Row, Col } from "antd";
import axios from "axios";

import "./categories.css";
import CategoryItem from "./categoryItem";
import AddCategory from "../categories/addCategory";

import { API_ADMIN } from "../../context/constants";
import AddSubCategory from "./addSubCategory";
const urlGET = API_ADMIN + "catalogo-organizacion";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 1075,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 835,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 585,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Categories = () => {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});

  const handleClick = (e) => {
    if (typeof e.item !== "undefined") {
      setSelectedCategory(e.item);
      const myObjStr = JSON.stringify(e.item);
      console.log("Received in Categories" + myObjStr);
    }
  };

  //Update only at first load
  useEffect(() => {
    axios
      .get(urlGET)
      .then((res) => setCategories(res.data.catalogoOrganizacionDTOList));
  }, []);

  return (
    <div className="categories">
      <Row wrap={false}>
        <Col flex="420px">
          <AddCategory />
        </Col>
        <Col flex="auto" onClick={handleClick}>
          <Slider {...settings}>
            {categories.length != null &&
              categories.map((item) => (
                <CategoryItem
                  key={item.catalogoOrganizacionId}
                  category={item}
                />
              ))}
          </Slider>
        </Col>
      </Row>
      <Row wrap={false}>
        <Col flex="auto">
          <AddSubCategory selectedCategory={selectedCategory} />
        </Col>
      </Row>
    </div>
  );
};

export default Categories;
