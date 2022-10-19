const router = require("express").Router();
const passport = require("passport");

const { RESULT_CODES } = require("../utils/index");
const {
  createProduct,
  getProductById,
  getAllProducts,
  getProductsByCategory,
  getMyProducts,
  getProductByFilter,
  updateProduct,
} = require("../controllers/product");

require("../middlewares/userAuth");

const inputValidator = require("../middlewares/inputValidator");
const validator = require("./validators/postProduct");

router.post(
  "/",
  inputValidator(validator),
  passport.authenticate("jwt", { session: false }),
  async ({ body, user }, res) => {
    try {
      const product = await createProduct({
        ...body,
        userId: parseInt(user.id, 10),
      });

      res.status(200).send({ product });
    } catch (error) {
      res.json({ error: error.message });
    }
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async ({user, query: {searchText, id}}, res) => {
    try {
      if (!searchText && !id) {
        const products = await getAllProducts({ userId: user.id });
        res.status(200).send( products );
      } else if (searchText) {
        const products = await getProductByFilter({ searchText });
        res.status(200).send( products );
      } else if (id) {
        const product = await getProductById({ id });
        res.status(200).send( product );
      }
    } catch (error) {
      res.json({ error: error.message });
    }
  }
);

router.get(
  "/categories",
  passport.authenticate("jwt", { session: false }),
  async ({ user }, res) => {
    try {
      const products = await getProductsByCategory({
        userId: parseInt(user.id, 10),
      });

      res.status(200).send(products);
    } catch (error) {
      res.json({ error: error.message });
    }
  }
);

router.get(
  "/my_products",
  passport.authenticate("jwt", { session: false }),
  async ({ user }, res) => {
    try {
      const products = await getMyProducts({ userId: user.id });

      if (products.code === RESULT_CODES.USER_NOT_FOUND) {
        return res.status(404).send(products);
      }

      res.status(200).send(products);
    } catch (error) {
      res.json({ error: error.message });
    }
  }
);

router.get(
  "/filter/:param",
  passport.authenticate("jwt", { session: false }),
  async (_, res) => {
    try {
      const product = await getProductByFilter();

      res.status(200).send({ product });
    } catch (error) {
      res.json({ error: error.message });
    }
  }
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async ({ body, params, user }, res) => {
    try {
      const product = await updateProduct({
        ...body,
        id: parseInt(params.id, 10),
        userId: parseInt(user.id, 10),
      });

      if (product.code[RESULT_CODES.PRODUCT_NOT_FOUND]) {
        res.status(404).send({ product })
      }

      res.status(200).send({ product });
    } catch (error) {
      res.json({ error: error.message });
    }
  }
);

module.exports = router;
