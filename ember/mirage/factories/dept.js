import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({

    dept: faker.name.firstName

});
