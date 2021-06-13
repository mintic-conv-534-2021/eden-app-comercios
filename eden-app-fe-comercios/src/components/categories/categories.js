import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Row, Col } from "antd";
import axios from "axios";

import "./categories.css";
import CategoryItem from "./categoryItem";
import AddCategory from "../categories/addCategory";

import { API_ADMIN } from "../../context/constants";
import AddSubCategory from "./addSubCategory";

const urlGET = API_ADMIN + "catalogo-organizacion?filtrar-activos=true";
const urlDeleteCat = API_ADMIN + "catalogo-organizacion/activo";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
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
        slidesToShow: 1,
        slidesToScroll: 1,
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
  const [editCategory, setEditCategory] = useState({});

  /* const myObjStr = JSON.stringify(e.item);
  console.log("Received in Categories" + myObjStr); */

  const handleClick = (e) => {
    if (typeof e.item !== "undefined") {
      if (e.item.action === "show"){
        setSelectedCategory(e.item.category);
      }
      else if (e.item.action === "delete"){
        DeleteItem(e.item.category);      
      }
      else if (e.item.action === "edit"){
        setEditCategory(e.item);
      }
    }
  };

  const DeleteItem = (item) => {
    axios
    .put(urlDeleteCat 
      + "?catalogoOrganizacionId=" 
      + item.catalogoOrganizacionId 
      + "&activo=false", 
    )
    .then((response) => {
      if (response.status === 202) {
        //Setear nuevamente Categories
        setCategories(categories.filter(cat => cat.catalogoOrganizacionId !== item.catalogoOrganizacionId ));
      }
      else{
        console.log("Unhandled status: " + response.status);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //Update only at first load
  useEffect(() => {
    axios
      .get(urlGET)
      .then((res) => setCategories(res.data.catalogoOrganizacionDTOList))
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const GenerateProps = (e) => {
    let props = {
      category: e,
      showActionButton: true,
    };
    return props;
  };

  return (
    <div className="categories">
      <Row wrap={false}>
        <Col flex="420px">
          <AddCategory categoryToEdit={editCategory} />
        </Col>
        <Col flex="auto" onClick={handleClick}>
          <Slider {...settings}>
            {categories.length != null &&
              categories.map((item) => (
                <CategoryItem
                  key={item.catalogoOrganizacionId}
                  category={GenerateProps(item)}
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
