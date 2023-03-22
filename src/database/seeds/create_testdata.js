const bcrypt = require('bcrypt')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('users').del()
    await knex('stories').del()
    await knex('paragraphs').del()
    await knex('users').insert([
        { username: 'admin', password: await bcrypt.hash('admin', 12) },
        { username: 'simon', password: await bcrypt.hash('simon', 12) },
        { username: 'troy', password: await bcrypt.hash('troy', 12) },
        { username: 'laure', password: await bcrypt.hash('laure', 12) },
        { username: 'tom', password: await bcrypt.hash('tom', 12) },
        { username: 'maxime', password: await bcrypt.hash('maxime', 12) }
    ])
    await knex('stories').insert([
    {
        name: 'L\'Histoire de ma vie',
        open: true,
        readable: true,
        endings: 1,
        userId: 1
    },
    {
        name: 'Les aventures de Gromul le Gobelin',
        open: true,
        readable: true,
        endings: 1,
        userId: 1
    },
    {
        name: 'Planète X',
        open: false,
        readable: true,
        endings: 1,
        userId: 3
    },
    {
        name: 'La prise de la Bastille',
        open: true,
        readable: false,
        endings: 0,
        userId: 2
    }
    ])
    await knex('paragraphs').insert([
    {
        paraNum: 1,
        userId: 2,
        storyId: 4,
        text: 'Au petit matin du 14 juillet 1789, le peuple de Paris se réveille en colère.',
        writeOngoing: null
    },
    {
        paraNum: 1,
        userId: 3,
        storyId: 3,
        text: 'Vu de l\'espace, elle n\'avait pas l\'air si hostile...',
        writeOngoing: null
    },
    {
        paraNum: 2,
        userId: 2,
        storyId: 3,
        text: 'Le vaisseau s\'écrase à la surface de la terrible Planète X!',
        writeOngoing: null
    },
    {
        paraNum: 1,
        userId: 1,
        storyId: 2,
        text: 'Gromul pose sa chope de bière sur le comptoir de la taverne et s\'essuie la bouche du revers de la main.',
        writeOngoing: null
    },
    {
        paraNum: 3,
        userId: 4,
        storyId: 2,
        text: 'Gromul, sur le pas de la taverne, se fait exploser le crâne par Trouduc le Troll.',
        writeOngoing: null
    },
    {
        paraNum: 1,
        userId: 1,
        storyId: 1,
        text: 'Il était une fois, un petit enfant. Cet enfant c\'était moi!',
        writeOngoing: null
    },
    {
        paraNum: 2,
        userId: 2,
        storyId: 1,
        text: '',
        writeOngoing: null
    },
    {
        paraNum: 3,
        userId: 1,
        storyId: 1,
        text: 'para 3',
        writeOngoing: null
    },
    {
        paraNum: 4,
        userId: 1,
        storyId: 1,
        text: 'para 4',
        writeOngoing: null
    },
    {
        paraNum: 5,
        userId: 1,
        storyId: 1,
        text: 'para 5',
        writeOngoing: null
    },
    {
        paraNum: 6,
        userId: 2,
        storyId: 1,
        text: 'para 6',
        writeOngoing: null
    },
    {
        paraNum: 7,
        userId: 1,
        storyId: 1,
        text: 'para 7',
        writeOngoing: null
    },
    {
        paraNum: 8,
        userId: 1,
        storyId: 1,
        text: 'para 8',
        writeOngoing: null
    }
    ])
    await knex('choices').insert([
        { text: 'J\'ai eu une enfance heureuse', storyId: 1, paraNum1: 1, paraNum2: 2 },
        { text: 'J\'ai eu une enfance malheureuse', storyId: 1, paraNum1: 1, paraNum2: 3 },
        { text: 'gauche', storyId: 1, paraNum1: 2, paraNum2: 4 },
        { text: 'droite', storyId: 1, paraNum1: 2, paraNum2: 5 },
        { text: 'gauche', storyId: 1, paraNum1: 3, paraNum2: 5 },
        { text: 'droite', storyId: 1, paraNum1: 3, paraNum2: 6 },
        { text: 'gauche', storyId: 1, paraNum1: 5, paraNum2: 7 },
        { text: 'droite', storyId: 1, paraNum1: 5, paraNum2: 8 },
        { text: 'droite', storyId: 1, paraNum1: 4, paraNum2: 9 },
        { text: 'droite', storyId: 1, paraNum1: 4, paraNum2: 10 },
        { text: 'droite', storyId: 1, paraNum1: 6, paraNum2: 11 },
        { text: 'droite', storyId: 1, paraNum1: 6, paraNum2: 12 },
        { text: 'droite', storyId: 1, paraNum1: 8, paraNum2: 13 },
        { text: 'Il prend son épée', storyId: 2, paraNum1: 1, paraNum2: 2 },
        { text: 'Il prend son marteau', storyId: 2, paraNum1: 1, paraNum2: 3 },
        { text: 'On atterit!', storyId: 3, paraNum1: 1, paraNum2: 2 },
        { text: 'Réunir les sans-culottes', storyId: 4, paraNum1: 1, paraNum2: 2 },
        { text: 'Aller chercher sa fourche', storyId: 4, paraNum1: 1, paraNum2: 3 }
    ])
    await knex('conclusion').insert([
        { storyId: 1, paraNum: 7 },
        { storyId: 2, paraNum: 3 },
        { storyId: 3, paraNum: 2 }
    ])
    await knex('guests').insert([
        { storyId: 3, userId: 2 }
    ])
};