export const getOne = (model) => async (req, res) => {
  try {
    const doc = await model.findOne({}).lean().exec();

    if (!doc) {
      return res.status(400).end();
    }
    res.status(200).json({ data: doc });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getMany = (model) => async (req, res) => {
  try {
    const docs = await model.find({}).lean().exec();

    if (!doc) {
      return res.status(400).end();
    }
    res.status(200).json({ data: docs });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

create