import { ObjectID } from "mongodb";

const convertMongoData = (data) => JSON.parse(JSON.stringify(data));

export async function getStories(db, limit, genres) {
    const searchCriteria = genres !== undefined
        ? { genres: { $all: genres } }
        : {};

    const stories = await db
        .collection("stories")
        .find(searchCriteria)
        .sort({ _id: 1 })
        .limit(limit)
        .toArray();
    return convertMongoData(stories);
}

export async function getStoryById(db, id) {
    const story = await db.collection("stories").findOne(
        {
            _id: ObjectID(id),
        },
        {
            projection: {
                title: 1,
                text: 1,
                author: 1,
                genres: 1,
                likes: 1,
            },
        }
    );
    return convertMongoData(story);
}

export async function updateStoryById(db, id, update) {
    return db.collection('stories').findOneAndUpdate(
      { _id: ObjectID(id) },
      { $set: update },
      { returnOriginal: false },
    )
  }

  export async function insertStory(db, {
    title, text, genres, author, user_id
  }) {
    return db
      .collection('stories')
      .insertOne({
        title, 
        text, 
        genres, 
        author, 
        user_id
      })
      .then(({ ops }) => ops[0]);
  }
