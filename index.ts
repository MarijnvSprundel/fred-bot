import { createAudioPlayer } from '@discordjs/voice';
import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';
const {joinVoiceChannel, AudioPlayerStatus, createAudioResource, AudioPlayerState} = require('@discordjs/voice');
dotenv.config();

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

let voiceChannelId: string | undefined;
let voiceConnection: any;
client.on('messageCreate', (message) => {
    if(message.content.toLowerCase().includes("fred") && !message.content.toLowerCase().includes("stop")){
        message.reply({
            content: 'Ik kom eraan hahahahha',
            files: [{attachment: "fred.png"}]
        });
        voiceConnection = connect(message.member?.voice.channel?.id, message.guild?.id, message.guild?.voiceAdapterCreator);
        if(voiceConnection != undefined){
            const player = createAudioPlayer();
            const resource = createAudioResource('song.mp3');
            voiceConnection.subscribe(player);
            player.play(resource);
            voiceChannelId = message.member?.voice.channel?.id;
            player.on(AudioPlayerStatus.Idle, () => {
                voiceConnection.destroy();
                voiceChannelId = undefined;
            });
        }
    }
    if(message.content.toLowerCase().includes("stop fred")){
        if(voiceConnection != undefined && message.member?.voice.channel?.id == voiceChannelId){
            voiceConnection.destroy();
            voiceChannelId = undefined;
        }
    }
});

function connect(channelId: string | undefined, guildId: string | undefined, adapterCreator: DiscordJS.InternalDiscordGatewayAdapterCreator | undefined){
    let connection;
    return connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: adapterCreator
    });
}

client.login(process.env.token);