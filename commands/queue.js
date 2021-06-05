module.exports = {
	name: 'queue',
	description: 'Get the list of songs in queue',
	alias: ['queue', 'q'],
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing in queue.');
        let queueList = "Queue:\n"
        serverQueue.songs.forEach((song, index) => {
            queueList += `${index+1}. ${song.title}\n`
        });
		return message.channel.send(`${queueList}`);
	},
};