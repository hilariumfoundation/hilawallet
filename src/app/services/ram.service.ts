import { Injectable } from '@angular/core';
import { EOSJSService } from '../eosjs.service';
import { NetworkService } from '../network.service';

@Injectable({
  providedIn: 'root'
})
export class RamService {

  ramPriceEOS = 0;
  total_ram_bytes_reserved = 0;
  total_ram_stake = 0;
  max_ram_size = 0;
  rm_base = 0;
  rm_quote = 0;
  rm_supply = 0;
  reloaderInterval = null;

  constructor(private eos: EOSJSService,
    public network: NetworkService) {
  }

  async reload() {
    try {
      await this.network.waitingConnect();
      this.eos.getChainInfo().then((global) => {
        // console.log(global);
        this.max_ram_size = global.rows[0]['max_ram_size'];
        this.total_ram_bytes_reserved = global.rows[0]['total_ram_bytes_reserved'];
        this.total_ram_stake = global.rows[0]['total_ram_stake'];
        this.eos.getRamMarketInfo().then((rammarket) => {
          // console.log(rammarket);
          this.rm_base = rammarket.rows[0]['base']['balance'].split(' ')[0];
          this.rm_quote = rammarket.rows[0]['quote']['balance'].split(' ')[0];
          this.rm_supply = rammarket.rows[0]['supply'].split(' ')[0];
          this.updatePrice();
          this.startLoop();
        });
      });
    } catch (error) {
      console.log('Error in method reload in ram.service.ts');
      console.log(error);
    }
  }

  startLoop() {
    if (!this.reloaderInterval) {
      this.reloaderInterval = setInterval(() => {
        this.reload();
      }, 5000);
    }
  }

  updatePrice() {
    this.ramPriceEOS = ((this.rm_quote) / this.rm_base) * 1024;
  }
}
