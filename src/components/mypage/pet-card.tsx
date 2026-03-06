import Link from 'next/link';

type PetData = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birth_date: string | null;
  weight_kg: number | null;
};

type PetCardProps = {
  pet: PetData;
};

function getAgeLabel(birthDate: string | null): string {
  if (!birthDate) {
    return '나이 정보 없음';
  }

  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) {
    return '나이 정보 없음';
  }

  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    years -= 1;
  }

  if (years < 0) {
    return '나이 정보 없음';
  }

  return `${years}살`;
}

function PetIcon({ species }: { species: string }) {
  const normalized = species.toLowerCase();
  const isCat = normalized.includes('cat') || normalized.includes('고양');

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff7a45]" fill="currentColor" stroke="none">
      {isCat ? (
        <>
          <path d="M12 20c-4 0-7-2.5-7-6 0-2.5 1.5-5 3-6.5L10 4l1 3h2l1-3 2 3.5c1.5 1.5 3 4 3 6.5 0 3.5-3 6-7 6Z" />
          <circle cx="9.5" cy="13" r="1" fill="white" />
          <circle cx="14.5" cy="13" r="1" fill="white" />
          <ellipse cx="12" cy="15" rx="1" ry="0.6" fill="white" />
        </>
      ) : (
        <path d="M8.35 3C6.97 3 5.85 4.35 5.85 6s1.12 3 2.5 3 2.5-1.35 2.5-3-1.12-3-2.5-3Zm7.3 0c-1.38 0-2.5 1.35-2.5 3s1.12 3 2.5 3 2.5-1.35 2.5-3-1.12-3-2.5-3ZM4.5 10c-1.38 0-2.5 1.35-2.5 3s1.12 3 2.5 3 2.5-1.35 2.5-3-1.12-3-2.5-3Zm15 0c-1.38 0-2.5 1.35-2.5 3s1.12 3 2.5 3 2.5-1.35 2.5-3-1.12-3-2.5-3ZM12 13.5c-2.33 0-4.3 1.45-5.08 3.5C6.26 18.8 7.73 21 10 21h4c2.27 0 3.74-2.2 3.08-4-.78-2.05-2.75-3.5-5.08-3.5Z" />
      )}
    </svg>
  );
}

export function PetCard({ pet }: PetCardProps) {
  return (
    <article className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0ea]">
            <PetIcon species={pet.species} />
          </span>
          <div>
            <h3 className="text-lg font-bold text-[#17191f]">{pet.name}</h3>
            <p className="text-sm text-[#697182]">
              {pet.species === 'dog' ? '강아지' : pet.species === 'cat' ? '고양이' : pet.species}
              {pet.breed ? ` · ${pet.breed}` : ''}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#fff0ea] px-3 py-1 text-xs font-semibold text-[#ff7a45]">
          {getAgeLabel(pet.birth_date)}
        </span>
      </div>

      {pet.weight_kg !== null ? (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#fff8f5] px-4 py-2.5 text-sm">
          <span className="font-medium text-[#697182]">체중</span>
          <span className="font-bold text-[#17191f]">{pet.weight_kg.toLocaleString('ko-KR')}kg</span>
        </div>
      ) : null}

      <Link
        href={`/mypage/records?petId=${encodeURIComponent(pet.id)}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#ff7a45] transition hover:text-[#e86d3c]"
      >
        진료 기록 보기
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4l4 4-4 4" /></svg>
      </Link>
    </article>
  );
}

export type { PetData };
