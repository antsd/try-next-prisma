import prisma from '../../lib/prisma';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.json({ error: 'No Id found' });
      return;
    }
    const user = await prisma.user.delete({
      where: { id },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Something Wrong' });
  }
};
