# prefer setuptools over distutils
from setuptools import setup

# use a consistent encoding
from codecs import open
from os import path
import json

here = path.abspath(path.dirname(__file__))
root = path.dirname(here)

readme = path.join(here, 'README.md')
package_json = path.join(here, 'meta.json')
# a workaround when installing locally from git repository with pip install -e .
if not path.isfile(package_json):
    package_json = path.join(root, 'meta.json')

# long description from README file
with open(readme, encoding='utf-8') as f:
    long_description = f.read()

# version number and all other params from package.json
with open(package_json, encoding='utf-8') as f:
    package = json.load(f)

raw_version = package['version']
version = '0.' + raw_version[2:]

setup(
    name=package['name'],
    version=version,
    description=package['description'],
    long_description=long_description,
    long_description_content_type='text/markdown',

    # will switch from rst to md shortly
    # long_description_content_type='text/markdown',

    url=package['homepage'],

    author=package['author']['name'],
    author_email=package['author']['email'],

    license=package['license'],

    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'Intended Audience :: Financial and Insurance Industry',
        'Intended Audience :: Information Technology',
        'Topic :: Software Development :: Build Tools',
        'Topic :: Office/Business :: Financial :: Investment',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
        'Programming Language :: JavaScript',
        'Programming Language :: PHP',
        'Operating System :: OS Independent',
        'Environment :: Console'
    ],

    keywords=package['keywords'],

    python_requires='>=3.10',

    install_requires=[
        'setuptools>=60.9.0',
        'certifi>=2018.1.18',
        'requests>=2.18.4',
        'cryptography>=2.6.1',
        'typing_extensions>=4.4.0',
        'aiohttp>=3.14.4,<3.15',
        'aiodns>=1.1.1',
        'yarl>=1.7.2',
    ],

    extras_require={
        'qa': [
            'ruff==0.0.292',
            'tox>=4.8.0',
        ],
        'type': [
            'mypy==1.6.1',
        ],
    },
    project_urls=package['project_urls'],
)
