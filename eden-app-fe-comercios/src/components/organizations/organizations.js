import React, { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import axios from "axios";
import Slider from "react-slick";

import CategoryItem from "../categories/categoryItem";
import OrganizationItem from "./organizationItem";
import { API_ADMIN } from "../../context/constants";

import "./organizations.css";
const urlCategories = API_ADMIN + "catalogo-organizacion";
const urlOrganizations = API_ADMIN + "organizacion/catalogo-organizacion/";
const { Title } = Typography;

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
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

const settingsOrg = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesPerRow: 4,
  responsive: [
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 3,
        slidesPerRow: 2,
      },
    },
    {
      breakpoint: 1075,
      settings: {
        slidesToShow: 3,
        slidesPerRow: 2,
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
        slidesToShow: 3,
        slidesPerRow: 2,
      },
    },
  ],
};

const Organizations = () => {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const [organizations, setOrganizations] = useState({});
  const [viewTitle, setViewTitle] = useState(false);

  //Update only at first load
  useEffect(() => {
    axios
      .get(urlCategories)
      .then((res) => setCategories(res.data.catalogoOrganizacionDTOList));
  }, []);

  const GenerateProps = (e) => {
    let props = {
      category: e,
      showActionButton: false,
    };
    return props;
  };

  const handleClick = (e) => {
    if (typeof e.item !== "undefined") {
      setSelectedCategory(e.item);
      const myObjStr = JSON.stringify(e.item);
      console.log("Received in Categories" + myObjStr);

      setViewTitle(true);

      axios
        .get(urlOrganizations + e.item.catalogoOrganizacionId)
        .then((res) => {
          setOrganizations(res.data.organizacionDTOList);
        })
        .catch(function (error) {
          setOrganizations({});
          console.log(error);
        });
    }
  };

  return (
    <div className="organizations">
      <Row wrap={false}>
        <Col flex="auto" className="categories" onClick={handleClick}>
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
        <Col flex="auto" className="subdivision"></Col>
      </Row>
      <Row wrap={false}>
        <Col flex="auto" className="organization-items">
          <Row>
            <Col>
              <Title className={viewTitle ? "title" : "title-hide"} level={2}>
                Catálogo de {selectedCategory.nombre}
              </Title>
            </Col>
            <Col>
            {/*               
              <Link
                className={viewTitle ? "new-button" : "new-button-hide"}
                to={{
                  pathname: "/organizations/add",
                  state: {},
                }}
              >
                <span>Nueva Categoría</span>
              </Link> 
            */}
            </Col>
          </Row>
          <Slider {...settingsOrg}>
            {organizations.length != null &&
              organizations.map((item) => (
                <OrganizationItem
                  key={item.organizacionId}
                  organization={item}
                />
              ))}
          </Slider>
        </Col>
      </Row>
    </div>
  );
};

export default Organizations;
