// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { user } = req.body;
    const savedUser = await prisma.user.create({
      data: user,
    });
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(404).json({ message: 'Something Wrong' });
  }
};
