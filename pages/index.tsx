import Head from 'next/head';

import {
  Button,
  Container,
  Divider,
  Form,
  Header,
  Image,
  Icon,
  Table,
} from 'semantic-ui-react';
import { Prisma } from '@prisma/client';
import { fetcher } from '../utils/fetcher';
import prisma from '../lib/prisma';
import { useState } from 'react';

export async function getServerSideProps() {
  const users: Prisma.UserUncheckedUpdateInput[] = await prisma.user.findMany();
  return {
    props: { initialUsers: users },
  };
}

export default function Home({ initialUsers }) {
  const [users, setUsers] =
    useState<Prisma.UserUncheckedUpdateInput[]>(initialUsers);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState();
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleChange = (e, { value }) => setRole(value);

  const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  const options = [
    { key: 'd', text: 'DEVELOPER', value: 'DEVELOPER' },
    { key: 'u', text: 'USER', value: 'USER' },
    { key: 'a', text: 'ADMIN', value: 'ADMIN' },
  ];

  return (
    <>
      <Head>
        <title>Prisma Next</title>
      </Head>
      <Container style={{ margin: 20 }}>
        <Header as='h3'>Next Prisma Crud</Header>
        <Form
          onSubmit={async () => {
            const body: Prisma.UserCreateInput = {
              firstName,
              lastName,
              role,
              email,
              avatar,
            };

            await fetcher('/api/create', { user: body });
            await setUsers([...users, body]);
            setFirstName('');
            setAvatar('');
            setLastName('');
            setRole(null);
            setEmail('');
          }}
        >
          <Form.Group widths='equal'>
            <Form.Input
              fluid
              label='First Name'
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <br />
            <Form.Input
              fluid
              label='Last Name'
              placeholder='Last Name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Form.Input
              fluid
              label='Email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Input
              fluid
              label='Avatar'
              placeholder='Avatar'
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
            <Form.Select
              fluid
              label='Role'
              placeholder='Role'
              options={options}
              value={role}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Button>Submit</Form.Button>
        </Form>
        <Divider horizontal>User</Divider>
        <Table basic='very' celled collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((user, i) => (
              <Table.Row key={i}>
                <Table.Cell>
                  <Header as='h4' image>
                    <Image
                      src={user.avatar}
                      alt={user.firstName}
                      rounded
                      size='mini'
                    />
                    <Header.Content>
                      {user.firstName + ' ' + user.lastName}
                      <Header.Subheader>
                        {capitalize(user.role)}
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <Button
                    animated='fade'
                    color='red'
                    onClick={async () => {
                      await fetcher('/api/delete', { id: user.id });
                      await setUsers(users.filter((usr) => usr !== user));
                    }}
                  >
                    <Button.Content visible>Delete</Button.Content>
                    <Button.Content hidden>
                      <Icon name='user delete' />
                    </Button.Content>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    </>
  );
}
