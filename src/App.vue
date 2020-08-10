<template>
	<div id="app">
		<button @click="showDeviceList = !showDeviceList">Show device list</button>
		<div v-if="showDeviceList">
			<div><b>Device list:</b></div>
			<ul>
				<li v-for="d in devices">
					<ul>
						<li><b>Device:</b> {{ d.deviceId }}</li>
						<li><b>GroupId:</b> {{ d.groupId }}</li>
						<li><b>Kind:</b> {{ d.kind }}</li>
						<li><b>Label:</b> {{ d.label }}</li>
					</ul>
					<hr>
				</li>
			</ul>
			<div><b>Video tracks:</b></div>
			<ul>
				<li v-for="d in videoTracks">
					<ul>
						<li><b>Device:</b> {{ d.deviceId }}</li>
						<li><b>GroupId:</b> {{ d.groupId }}</li>
						<li><b>Kind:</b> {{ d.kind }}</li>
						<li><b>Label:</b> {{ d.label }}</li>
					</ul>
					<hr>
				</li>
			</ul>
			
			<div><b>Constraints:</b></div>
			<ul v-if="ctrs">
				<li v-for="(v, k) in ctrs">
					{{ k }}: {{ v }}
				</li>
			</ul>
		</div>


		<video ref="video" autoplay playsinline></video>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';

	@Component
	export default class App extends Vue {

		showDeviceList = true;
		devices: MediaDeviceInfo[] = [];
		videoTracks: MediaStreamTrack[] = [];
		ctrs?: MediaTrackSupportedConstraints;

		async mounted(){
			this.devices = await this.getDevices()

			let videoEl = this.$refs.video as HTMLVideoElement;
			// videoEl.srcObject = await this.getDepthStream();
			let stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false
			});
			videoEl.srcObject = stream;
			this.videoTracks = stream.getVideoTracks();
			this.ctrs = navigator.mediaDevices.getSupportedConstraints();
			console.log(this.videoTracks)

			// let stream =
			// this.$refs['video'].
		}
		async getDevices(): Promise<MediaDeviceInfo[]> {
			return await navigator.mediaDevices.enumerateDevices();
		}

		getConstraintsForDepthDevice() {
			return new Promise<MediaStreamConstraints>(function(resolve, reject) {
				navigator.mediaDevices.enumerateDevices()
					.then(function(devices) {
						for (let i = 0; i < devices.length; ++i) {
							if (devices[i].label.indexOf("Depth") != -1) {
								return resolve({video:{deviceId: {exact: devices[i].deviceId}}});
							}
						}
						return reject("No depth device found");
					})
			});
		}

		async getDepthStream() {
			let constraints = await this.getConstraintsForDepthDevice()
			if (!constraints)
				throw "No depth device found";

			return navigator.mediaDevices.getUserMedia(constraints);
		}
	}
</script>

<style>
	video {
		display: block;
		margin-top: 50px;
		width: 600px;
		max-width: 100%;
	}
</style>
