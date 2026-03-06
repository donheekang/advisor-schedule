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

export function PetCard({ pet }: PetCardProps) {
  return (
    <article className="rounded-2xl border border-[#1B3A4B]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-[#1B3A4B]">{pet.name}</h3>
          <p className="mt-1 text-sm text-slate-600">
            {pet.species}
            {pet.breed ? ` · ${pet.breed}` : ''}
          </p>
        </div>
        <span className="rounded-full bg-[#2A9D8F]/15 px-3 py-1 text-xs font-semibold text-[#1B3A4B]">{getAgeLabel(pet.birth_date)}</span>
      </div>

      <dl className="mt-4 space-y-1 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <dt>체중</dt>
          <dd className="font-semibold text-[#1B3A4B]">
            {pet.weight_kg !== null ? `${pet.weight_kg.toLocaleString('ko-KR')}kg` : '정보 없음'}
          </dd>
        </div>
      </dl>

      <Link
        href={`/mypage/records?petId=${encodeURIComponent(pet.id)}`}
        className="mt-4 inline-flex rounded-lg bg-[#1B3A4B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#163242]"
      >
        진료 기록 보기
      </Link>
    </article>
  );
}

export type { PetData };
