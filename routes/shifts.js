const router = require("express").Router();
const Shift = require("../models/Shifts");

router.post("/register", async (req, res) => {
  try {
    const dt = new Date();
    // const year = new Date().getFullYear();
    // const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const year = dt.getFullYear();

    for (let i = 1; i <= 4; i++) {
      for (let i = 1; i <= 12; i++) {
        const daysInMonth = new Date(year, 1, 0).getDate();
        for (let j = 1; j <= daysInMonth; j++) {
          // var shift = new Shift({
          // date: `${year}-${i}-${j}`,
          // shift: "",
          // });
          console.log(`${year}-${i}-${j}`);
          console.log(new Date(`${year}-${i}-${j}`).getDay());
        }
      }
    }

    // const newShift = await new Shift({
    //   anio: year,
    //   nombre: req.body.nombre,
    // });
    // const shift = await newShift.save();
    res.status(200).json("newShift");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
