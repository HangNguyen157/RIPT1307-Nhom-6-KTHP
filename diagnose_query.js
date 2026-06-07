const { initDatabase, sequelize } = require('./src/server/db');
const { QuestionEntity, UserEntity, TagEntity } = require('./src/server/models/entities');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

async function diagnose() {
  try {
    await initDatabase();
    console.log('Database initialized');

    const whereClause = { status: { [Op.ne]: 'hidden' } };
    
    console.log('Running basic query...');
    const basicCount = await QuestionEntity.count({ where: whereClause });
    console.log('Basic count (no includes):', basicCount);

    const authorInclude = {
      model: UserEntity,
      as: 'author',
      attributes: ['name', 'role', 'reputation', 'department'],
      required: false,
    };

    const tagInclude = {
      model: TagEntity,
      as: 'questionTags',
      through: { attributes: [] },
      required: false,
    };

    console.log('Running query with includes...');
    const { count, rows } = await QuestionEntity.findAndCountAll({
      where: whereClause,
      include: [authorInclude, tagInclude],
      limit: 10,
      offset: 0,
      distinct: true,
      logging: console.log
    });

    console.log('Query with includes count:', count);
    console.log('Rows returned:', rows.length);
    if (rows.length > 0) {
      console.log('First row mapping test:', JSON.stringify(rows[0].get({plain:true}), null, 2).substring(0, 500));
    }

    process.exit(0);
  } catch (error) {
    console.error('Diagnosis failed:', error);
    process.exit(1);
  }
}

diagnose();
