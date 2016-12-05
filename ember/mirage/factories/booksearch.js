import { Factory, faker  } from 'ember-cli-mirage';

export default Factory.extend({
    Term: "20171",
    Department: faker.name.firstName,
    Course: faker.random.number,
    ISBN: faker.random.number,
    Title: faker.name.firstName,
    New_Price: '100',
    Ebook_Price: ""

});
