import React from 'react';
import type { Metadata } from 'next';
import { LordIcon } from '@/components/ui/LordIcon';

export const metadata: Metadata = {
  title: 'Current Learning',
  description:
    'Active technical topics, engineering papers, systems experiments, and reference resources being studied by Ali Raza.',
};

interface LearningTopic {
  title: string;
  category: string;
  iconSrc: string;
  palette: 'code' | 'doc' | 'gear' | 'colored';
  summary: string;
  objectives: string[];
  resources: Array<{
    name: string;
    url?: string;
    type: string;
  }>;
}

const topics: LearningTopic[] = [
  {
    title: 'Linux io_uring & High-Throughput Asynchronous I/O',
    category: 'Kernel & Systems Architecture',
    iconSrc: 'https://cdn.lordicon.com/xulqnnzg.json',
    palette: 'colored',
    summary:
      'Investigating Linux io_uring submission and completion ring buffers, kernel-bypass concepts, and zero-copy socket transfers compared to epoll multiplexing in Go.',
    objectives: [
      'Understand SQ/CQ ring memory sharing between user-space and kernel memory.',
      'Measure context-switch reduction under 100k+ concurrent TCP streams.',
      'Benchmark registered file descriptors and fixed buffers against Go netpoller.',
    ],
    resources: [
      {
        name: 'Efficient IO with io_uring (Jens Axboe, Kernel Guide)',
        url: 'https://kernel.dk/io_uring.pdf',
        type: 'paper',
      },
      {
        name: 'Linux Kernel Documentation: Documentation/filesystems/io_uring.rst',
        url: 'https://docs.kernel.org/',
        type: 'spec',
      },
      {
        name: 'Lord of the io_uring (Shuveb Hussain)',
        url: 'https://unixism.net/loti/',
        type: 'guide',
      },
    ],
  },
  {
    title: 'Log-Structured Merge-Trees (LSM) & Compaction Mechanics',
    category: 'Storage Engines & Databases',
    iconSrc: 'https://cdn.lordicon.com/qhgmphtg.json',
    palette: 'code',
    summary:
      'Writing an educational persistent key-value engine in Go featuring MemTables, Write-Ahead Logs (WAL), immutable SSTables, and background compaction to analyze write amplification.',
    objectives: [
      'Implement concurrent skip-list MemTable with lock-free reads.',
      'Construct block-indexed SSTables with CRC32 checksums and bloom filters.',
      'Analyze trade-offs between leveled compaction and tiered size-ratio compaction.',
    ],
    resources: [
      {
        name: 'The Log-Structured Merge-Tree (P. O’Neil, E. O’Neil, G. Weikum)',
        type: 'paper',
      },
      {
        name: 'Designing Data-Intensive Applications (Martin Kleppmann, Ch. 3)',
        type: 'book',
      },
      {
        name: 'RocksDB Architecture Guide & Write Amplification Analysis',
        url: 'https://github.com/facebook/rocksdb/wiki',
        type: 'guide',
      },
    ],
  },
  {
    title: 'Formal Verification of Distributed Protocols with TLA+',
    category: 'Distributed Systems',
    iconSrc: 'https://cdn.lordicon.com/wxnxiano.json',
    palette: 'doc',
    summary:
      'Specifying consensus algorithms and state machines formally using TLA+ and PlusCal to verify safety invariants (e.g. leader completeness, linearizable log indices) prior to implementation.',
    objectives: [
      'Model network partitions and asynchronous message reordering in TLC model checker.',
      'Draft formal safety and liveness invariants for Raft cluster membership changes.',
      'Prevent edge-case split-brain anomalies in custom replication topologies.',
    ],
    resources: [
      {
        name: 'Specifying Systems: The TLA+ Language (Leslie Lamport)',
        url: 'https://lamport.azurewebsites.net/tla/book.html',
        type: 'book',
      },
      {
        name: 'Practical TLA+: Planning Driven Development (Hillel Wayne)',
        type: 'book',
      },
      {
        name: 'Official Raft Consensus TLA+ Specification (Ongaro & Ousterhout)',
        url: 'https://github.com/ongardie/raft.tla',
        type: 'spec',
      },
    ],
  },
  {
    title: 'PostgreSQL Concurrency, MVCC & Isolation Anomalies',
    category: 'Relational Database Internals',
    iconSrc: 'https://cdn.lordicon.com/gsqxdxog.json',
    palette: 'gear',
    summary:
      'Analyzing PostgreSQL tuple header visibility maps, Serializable Snapshot Isolation (SSI) dependency graphs, predicate locks, and shared buffer pool dynamics under heavy write contention.',
    objectives: [
      'Reproduce and prevent write skew, read-only transaction anomalies, and lost updates.',
      'Profile tuple bloat, vacuum freeze horizons, and multixact tracking.',
      'Optimize complex analytical queries using EXPLAIN (ANALYZE, BUFFERS) breakdowns.',
    ],
    resources: [
      {
        name: 'A Critique of ANSI SQL Isolation Levels (Berenson et al.)',
        type: 'paper',
      },
      {
        name: 'PostgreSQL Internal Architecture & Concurrency Control Manual',
        url: 'https://www.postgresql.org/docs/current/mvcc.html',
        type: 'spec',
      },
      {
        name: 'The Internals of PostgreSQL (Hironobu Suzuki)',
        url: 'https://www.interdb.jp/pg/',
        type: 'guide',
      },
    ],
  },
];

export default function CurrentLearningPage() {
  return (
    <article className="space-y-10 max-w-content">
      {/* Header */}
      <header className="space-y-2 border-b border-border pb-6">
        <div className="flex items-center gap-2.5">
          <LordIcon
            src="https://cdn.lordicon.com/fkdjnafc.json"
            trigger="hover"
            palette="colored"
            size={26}
          />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Current Learning
          </h1>
        </div>
        <p className="text-secondary text-base leading-relaxed">
          An ongoing log of systems software topics, research papers, distributed
          protocols, and reference materials I am currently studying.
        </p>
      </header>

      {/* Topics List: Clean Markdown Notebook Flow */}
      <div className="space-y-10">
        {topics.map((topic, index) => (
          <section
            key={topic.title}
            className="space-y-3.5 border-b border-border/60 pb-8 last:border-b-0"
          >
            {/* Topic Title */}
            <div className="flex items-start gap-2.5">
              <LordIcon
                src={topic.iconSrc}
                trigger="hover"
                palette={topic.palette}
                size={22}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <h2 className="text-xl font-semibold text-foreground tracking-tight">
                  {index + 1}. {topic.title}
                </h2>
                <span className="text-xs font-mono text-muted">
                  {topic.category}
                </span>
              </div>
            </div>

            {/* Summary */}
            <p className="text-base text-secondary leading-relaxed pl-0 sm:pl-8">
              {topic.summary}
            </p>

            {/* Objectives */}
            <div className="space-y-1.5 pl-0 sm:pl-8 text-sm">
              <span className="font-mono text-xs uppercase tracking-wider text-muted block">
                Focus Objectives:
              </span>
              <ul className="list-disc pl-5 space-y-1 text-secondary">
                {topic.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Reference Resources */}
            <div className="space-y-1.5 pl-0 sm:pl-8 text-sm pt-1">
              <span className="font-mono text-xs uppercase tracking-wider text-muted block">
                References & Readings:
              </span>
              <ul className="space-y-1 font-mono text-xs text-secondary pl-1">
                {topic.resources.map((res, i) => (
                  <li key={i} className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-muted shrink-0">[{res.type}]</span>
                    {res.url ? (
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline"
                      >
                        {res.name} ↗
                      </a>
                    ) : (
                      <span className="text-foreground">{res.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
