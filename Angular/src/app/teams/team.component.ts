import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {Team} from '../Interfaces/team.model';
import {TeamService} from '../teams/team.service';
import {ActivatedRoute} from '@angular/router';
import {Match} from '../Interfaces/match.model';
import {MatchesService} from '../matches/matches.service';

import {Game} from '../Interfaces/game.model';


@Component({
  selector: 'app-teams',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class TeamComponent implements OnInit {

  private id: number;
  private team: Team;
  private lastMatches: Match[];


  constructor(private activatedRoute: ActivatedRoute,
              private teamService: TeamService,
              private matchesService: MatchesService) {
    this.id = activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.teamService.getTeam(this.id).subscribe(
      data => {
        this.team = data;
        // this.setChartGPMOptions();
        // this.setChartAVGOptions();
        // this.setChartWLOptions();
        console.log('Team: ', data);
      },
      error => this.handleError(error)
    );

    this.matchesService.getLastMatchesByTeam(this.id).subscribe(
      data => {
        this.lastMatches = data;
        console.log('Last matches of team: ', data);
      }
    );
  }

  private handleError(error: any) {
    console.error(error);
  }

  getTeam() {
    return this.team;
  }

  getLastMatches() {
    return this.lastMatches;
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
