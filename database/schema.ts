export const dropTables = `
  drop table if exists users;
  drop table if exists categories;
  drop table if exists posts;
  drop table if exists comments;
  drop table if exists likes;
`

export const createTables = `
  create table if not exists users (
    id integer primary key autoincrement,
    username text not null unique,
    email text not null unique,
    password_hash text not null,
    avatar_url text not null,
    created_at text default (datetime('now', 'utc'))
  );

  create table if not exists categories (
    id integer primary key autoincrement,
    name text not null unique
  );

  create table if not exists posts (
    id integer primary key autoincrement,
    user_id integer,
    category_id integer,
    caption text not null,
    image_url text not null,
    created_at text default (datetime('now', 'utc')),
    foreign key (user_id) references users(id),
    foreign key (category_id) references categories(id)
  );

  create table if not exists comments (
    id integer primary key autoincrement,
    post_id integer,
    user_id integer,
    content text not null,
    created_at text default (datetime('now', 'utc')),
    foreign key (post_id) references posts(id),
    foreign key (user_id) references users(id)
  );

  create table if not exists likes (
    id integer primary key autoincrement,
    post_id integer,
    user_id integer,
    created_at text default (datetime('now', 'utc')),
    unique (post_id, user_id),
    foreign key (post_id) references posts(id),
    foreign key (user_id) references users(id)
  );
`

export const insertDummy = `
insert into
  users (username, email, password_hash, avatar_url)
values
  (
    'john_doe',
    'john@example.com',
    'hashed_password_1',
    'https://picsum.photos/31'
  ),
  (
    'jane_smith',
    'jane@example.com',
    'hashed_password_2',
    'https://picsum.photos/32'
  ),
  (
    'alice_wonder',
    'alice@example.com',
    'hashed_password_3',
    'https://picsum.photos/33'
  );

insert into
  posts (user_id, category_id, caption, image_url)
values
  (
    1,
    1,
    'Our golden retriever, Max, went missing near the park. He is very friendly.',
    'https://picsum.photos/400'
  ),
  (
    2,
    2,
    'Found a black cat with a white spot on its chest. Seems lost and scared.',
    'https://picsum.photos/400'
  ),
  (
    3,
    3,
    'We have successfully adopted a beagle named Charlie. He is adjusting well.',
    'https://picsum.photos/400'
  );

insert into
  comments (post_id, user_id, content)
values
  (
    1,
    2,
    'I think I saw your dog near the lake yesterday.'
  ),
  (2, 1, 'Thank you for taking care of the cat!'),
  (3, 2, 'Congratulations on the adoption!');

insert into
  likes (post_id, user_id)
values
  (1, 3),
  (2, 1),
  (3, 1),
  (3, 2);
`
