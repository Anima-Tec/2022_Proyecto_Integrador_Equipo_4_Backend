const router = require("express").Router();
const passport = require('passport');

const { RESULT_CODES } = require("../utils/index");
const { createProduct, getProductById, getAllProducts, getProductsByCategory, getMyProducts} = require("../business/product");

require('../config/loginCheck')

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { body, user } = req;
      const product = await createProduct({ ...body, userId: parseInt(user.id, 10) });

      res.status(200).send({ product });
    } catch (error) {
      res.json({ error: error.message });
    }
  },
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const product = await getAllProducts();

      res.status(200).send({ product });
    } catch (error) {
      res.json({ error: error.message });
    }
  },
);

router.get(
  '/categories',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const products = await getProductsByCategory()

      res.status(200).send(products)
    } catch (error) {
      res.json({error: error.message})
    }
  }
)

router.get(
  '/my_products',
  passport.authenticate('jwt', { session: false }),
  async ({user}, res) => {
    try {
      const products = await getMyProducts({userId: user.id})
      
      if (products.code === RESULT_CODES.USER_NOT_FOUND) {
        return res.status(404).send(products)
      }
      
      res.status(200).send(products)
    } catch (error) {
      res.json({ error: error.message })
    }
  }
)

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const products = await getProductById({ id });

      res.status(200).send(products);
    } catch (error) {
      res.json({ error: error.message });
    }
  });

module.exports = router;
