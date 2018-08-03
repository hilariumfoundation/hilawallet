import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AccountsService } from '../../accounts.service';
import { EOSJSService } from '../../eosjs.service';
import { NetworkService } from '../../network.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import * as moment from 'moment';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit, AfterViewInit, OnDestroy {
	fullBalance: number;
	staked: number;
	unstaked: number;
	moment: any;
	openTX = WalletComponent.openTXID;
	actions: any[];
	headBlock: number;
	LIB: number;
	blockTracker: any;
	tokens: any[];
	time = 0;
	loading = false;

	static openTXID(value) {
		//window['shell']['openExternal']('https://eosflare.io/tx/' + value);
	}

	constructor(
		public eos: EOSJSService,
		public aService: AccountsService,
		public network: NetworkService,
		private titleService: Title,
		private route: ActivatedRoute
	) {
		this.moment = moment;
		this.actions = [];
		this.tokens = [];
		this.headBlock = 0;
		this.fullBalance = 0;
		this.staked = 0;
		this.unstaked = 0;
		this.LIB = 0;
		this.blockTracker = null;

		//Set title
		this.titleService.setTitle(this.route.snapshot.data['title']);
	}

	async getInfo() {
		try {
			await this.network.waitingConnect();
			var info = await this.eos.getInfo();
			this.headBlock = info['head_block_num'];
			this.LIB = info['last_irreversible_block_num'];
		} catch (error) {
			//this.getInfo();
			console.log(error);
		}
	}

	async ngOnInit() {
		this.loading = true;

		this.refresh();

		this.aService.lastUpdate.asObservable().subscribe(value => {
			if (value.account === this.aService.selected.getValue().name) {
				this.updateBalances();
			}
		});

		this.getInfo();

		if (!this.blockTracker) {
			this.blockTracker = setInterval(() => {
				this.getInfo();
			}, 5000);
		}

		// this.network.connect();
		// this.loading = false;
	}

	ngOnDestroy() {
		if (this.blockTracker) {
			clearInterval(this.blockTracker);
			this.blockTracker = null;
		}
	}

	ngAfterViewInit() {
		var self = this;
		self.loading = true;
		this.aService.selected.asObservable().subscribe((sel) => {
			if (sel['name']) {
				setImmediate(async () => {
					this.fullBalance = sel.full_balance;
					this.staked = sel.staked;
					this.unstaked = sel.full_balance - sel.staked;
					this.tokens = [];
					await this.aService.reloadActions(sel.name);
					this.aService.refreshFromChain();
					this.loading = false;
				});
			}
		});
	}

	updateBalances() {
		const sel = this.aService.selected.getValue();
		this.fullBalance = sel.full_balance;
		this.staked = sel.staked;
		this.unstaked = sel.full_balance - sel.staked;
	}

	async refresh() {
		try {
			this.loading = true;
			await this.network.waitingConnect();
			await this.aService.reloadActions(this.aService.selected.getValue().name);
			this.aService.refreshFromChain();
			this.loading = false;
		} catch (error) {
			console.log('Error in method refresh in wallet.component.ts');
			console.log(error);
		}
	}

	loadTransaction(value) {
		window.open('https://eosflare.io/tx/' + value, '_blank');
	}

}
