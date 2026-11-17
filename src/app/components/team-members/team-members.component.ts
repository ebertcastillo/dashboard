import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TeamMember {
  id: number;
  name: string;
  ci: string;
  initials: string;
}

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 transition-all print:border-slate-300 print:shadow-none">
      <!-- Subtle top decorative bar -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800"></div>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div class="flex items-center gap-2.5">
          <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-sky-100 text-sky-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Integrantes del Grupo
            </h3>
            <p class="text-[11px] text-slate-500">
              Equipo de Desarrollo • Tablero de Control Financiero
            </p>
          </div>
        </div>

        <span class="self-start sm:self-auto px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          4 Integrantes
        </span>
      </div>

      <!-- Members Grid (4 columns on desktop, 2 on tablet, 1 on mobile) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        @for (member of members; track member.id) {
          <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-all duration-200 group">
            <!-- Number & Initials Avatar -->
            <div class="relative shrink-0">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-sky-900 text-white font-black text-xs flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                {{ member.initials }}
              </div>
              <span class="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-sky-600 text-white text-[9px] font-black flex items-center justify-center border border-white">
                {{ member.id }}
              </span>
            </div>

            <!-- Member Details -->
            <div class="min-w-0 flex-1">
              <h4 class="text-xs font-bold text-slate-900 truncate group-hover:text-sky-950 transition-colors">
                {{ member.name }}
              </h4>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 font-mono shadow-2xs">
                  <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  C.I. {{ member.ci }}
                </span>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class TeamMembersComponent {
  readonly members: TeamMember[] = [
    {
      id: 1,
      name: 'Ebert Castillo Cortez',
      ci: '5959351 LP',
      initials: 'ECC'
    },
    {
      id: 2,
      name: 'Liz Yesenia Camacho Chamizo',
      ci: '6874190 LP',
      initials: 'LC'
    },
    {
      id: 3,
      name: 'Luis Edwin Mamani Saisa',
      ci: '4923188 LP',
      initials: 'LM'
    },
    {
      id: 4,
      name: 'Samuel Jonathan Pasquier Rios',
      ci: '12764087 LP',
      initials: 'SP'
    }
  ];
}
