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
		</div>


		<video ref="video"></video>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';

	@Component
	export default class App extends Vue {

		showDeviceList = false;
		devices: MediaDeviceInfo[] = [];

		async mounted(){
			this.devices = await this.getDevices()

			let videoEl = this.$refs.video as HTMLVideoElement;
			videoEl.srcObject = await this.getDepthStream();

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
		width: 1024px;
		max-width: 100%;
		height: 768px;
	}
</style>
