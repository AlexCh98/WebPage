import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Team} from "../../Interfaces/team.model";
import {TeamService} from "../team.service";
import {Game} from "../../Interfaces/game.model";

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.css']
})
export class LinechartComponent implements OnInit {
  data: any;
  @Input() private idTeam: number;
  private team: Team;

  constructor(private activatedRoute: ActivatedRoute,private teamService:TeamService) {
    this.idTeam = activatedRoute.snapshot.params.id;
  }


  ngOnInit(): void {
    this.teamService.getTeam(this.idTeam)
      .subscribe(data => {
          this.team = data;

          let games = this.parseGames();
          let yaxis :  string[] = []
          for (const i in games) {
            yaxis.push("Game " + String(Number(i)+1))
          }

          console.log("yaxis:", yaxis);

          this.data = {
            labels: yaxis,
            datasets: [
              {
                label:'Games per match',
                data: games
              }
            ]
          };
          console.log('Player info: ', data);
        }
      );

  }

  parseGames() {
    const gamesParsed: number[] = [];
    const games: Game[] = this.team.teamStatistics.gamesPerMatch;
    for (const i in games) {
      gamesParsed.push(games[i].games);
    }
    console.log('Games: ', gamesParsed);
    return gamesParsed;
  }

  parseStats() {
    const avgStats: number[] = [];
    const totalGames = this.team.teamStatistics.totalGames;
    const avgAcc = this.team.teamStatistics.totalAcurracy / totalGames;
    const avgEff = this.team.teamStatistics.totalEffectiveness / totalGames;
    const avgForced = this.team.teamStatistics.totalUnforcedErrors / totalGames;

    avgStats.push(avgAcc);
    avgStats.push(avgEff);
    avgStats.push(avgForced);

    return avgStats;
  }

  parseWL() {
    const parsed: number[] = [];
    parsed.push(this.team.teamStatistics.totalWins);
    parsed.push(this.team.teamStatistics.totalDefeats);
    return parsed;
  }



}
